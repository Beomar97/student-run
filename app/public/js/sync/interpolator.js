class Interpolator {
	constructor(matter, timeline, math, config) {
		this.matter = matter;
		this.timeline = timeline;
		this.math = math;
		this.maxDiff = config.maxDiff;
		this.lowerDistanceDiffThreshold = config.lowerDistanceDiffThreshold;
		this.upperDistanceDiffThreshold = config.upperDistanceDiffThreshold;
		this.interpolationMaxStep = config.interpolationMaxStep;
		this.ticDiffThreshold = config.ticDiffThreshold;
	}

	interpolate(gameObjectNow, gameObjectUpdate, currentTic, updateTic) {
		let ticDiff = currentTic - updateTic;
		if (ticDiff < 0) {
			console.log(
				"Warn: tic synchronisation negative. ticDiff: " + ticDiff
			);
			this.matter.body.setPosition(
				gameObjectNow.innerObject,
				gameObjectUpdate.position
			);
		} else if (ticDiff <= this.maxDiff) {
			let gameObjectThen = this.timeline.getGameObjectAtTic(
				updateTic,
				gameObjectNow.id
			);
			if (gameObjectThen) {
				this._interpolate(
					gameObjectNow,
					gameObjectThen,
					gameObjectUpdate,
					ticDiff
				);
			}
		}
	}

	_interpolate(gameObjectNow, gameObjectThen, gameObjectUpdate, ticDiff) {
		let distance = this.math.Distance.BetweenPoints(
			gameObjectUpdate.position,
			gameObjectThen.innerObject.position
		);

		if (distance >= this.lowerDistanceDiffThreshold) {
			let newPosition = null;
			if (distance <= this.upperDistanceDiffThreshold) {
				let diffDirection = new this.math.Vector2(
					gameObjectUpdate.position.x -
						gameObjectThen.innerObject.position.x,
					gameObjectUpdate.position.y -
						gameObjectThen.innerObject.position.y
				).scale(1 / distance);

				let maxStep = Math.min(distance, this.interpolationMaxStep);
				let interpolationStep =
					maxStep *
					this._calculateInterpolationPercentage(
						gameObjectNow,
						gameObjectUpdate,
						ticDiff
					);

				newPosition = {
					x:
						gameObjectNow.innerObject.position.x +
						diffDirection.x * interpolationStep,
					y:
						gameObjectNow.innerObject.position.y +
						diffDirection.y * interpolationStep,
				};
			} else {
				newPosition = gameObjectUpdate.position;
			}

			this.matter.body.setPosition(
				gameObjectNow.innerObject,
				newPosition
			);
		}
	}

	_calculateInterpolationPercentage(
		gameObjectNow,
		gameObjectUpdate,
		ticDiff
	) {
		let oneOrTicDiff = Math.max(ticDiff, 1);
		let interpolationPercentage = 1 / oneOrTicDiff;

		if (
			gameObjectNow.direction.x === gameObjectUpdate.direction.x &&
			gameObjectNow.direction.y === gameObjectUpdate.direction.y
		) {
			interpolationPercentage *=
				oneOrTicDiff *
				Math.min(this.ticDiffThreshold / oneOrTicDiff, 1);
		}

		return interpolationPercentage;
	}
}

module.exports = Interpolator;
