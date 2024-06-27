const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
	constructor(field) {
		this.field = field;
		// Initialize player at a random position
		this.playerPosition = this.getRandomStartPosition();
		this.field[this.playerPosition.y][this.playerPosition.x] = pathCharacter;
	}

	// Print the field to the console
	print() {
		this.field.forEach((row) => console.log(row.join(' ')));
	}

	// Generate a random field with given dimensions and hole percentage
	static generateField(height, width, percentage = 0.2) {
		const field = new Array(height).fill().map(() => new Array(width).fill(fieldCharacter));

		// Randomly place the hat
		const hatPosition = {
			x: Math.floor(Math.random() * width),
			y: Math.floor(Math.random() * height),
		};
		field[hatPosition.y][hatPosition.x] = hat;

		// Randomly place holes
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				if (Math.random() < percentage && field[i][j] !== hat && field[i][j] !== pathCharacter) {
					field[i][j] = hole;
				}
			}
		}

		return field;
	}

	// Get a random start position within the field boundaries
	getRandomStartPosition() {
		return {
			x: Math.floor(Math.random() * this.field[0].length),
			y: Math.floor(Math.random() * this.field.length),
		};
	}

	// Move the player based on the direction input
	move(direction) {
		// let x = this.playerPosition.x;
		// let y = this.playerPosition.y;

		//same as above simply destructured
		let { x, y } = this.playerPosition;

		switch (direction) {
			case 'u':
				y -= 1;
				break;
			case 'd':
				y += 1;
				break;
			case 'l':
				x -= 1;
				break;
			case 'r':
				x += 1;
				break;
			default:
				console.log('Invalid move');
				return true;
		}

		if (this.isOutOfBounds(x, y)) {
			console.log('You moved out of bounds!');
			return false;
		}

		const tile = this.field[y][x];
		if (tile === hole) {
			console.log('You fell into a hole!');
			return false;
		} else if (tile === hat) {
			console.log('You found your hat!');
			return false;
		}

		// Mark old position
		this.field[this.playerPosition.y][this.playerPosition.x] = pathCharacter;
		// Update to new position
		this.playerPosition = { x, y };
		// Mark new position
		this.field[y][x] = pathCharacter;

		return true;
	}

	// Check if the new position is out of bounds
	isOutOfBounds(x, y) {
		return (
			x < 0 ||
			x >= this.field[0].length ||
			y < 0 ||
			y >= this.field.length
		);
	}
}

// Game Logic
const height = 10;
const width = 10;
const percentageHoles = 0.2;

const myField = new Field(Field.generateField(height, width, percentageHoles));

let playing = true;

while (playing) {
	myField.print();
	const direction = prompt('Which way? (u for up, d for down, l for left, r for right): ').toLowerCase();
	playing = myField.move(direction);
}

console.log('Game Over!');
