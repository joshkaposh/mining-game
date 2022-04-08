import PlayerCollision from "./PlayerCollision.js";
import PlayerDrill from "./PlayerDrill.js";
import PlayerInventory from "./PlayerInventory.js";
import PlayerSprite from "./PlayerSprite.js";

class Entity {
	constructor(health, pos, velocity, flySpeed, width, height, worldW, worldH) {
		this.health = health;
		this.maxHP = health;
		this.isAlive = true;
		this.pos = pos;
		this.velocity = velocity;
		this.flySpeed = flySpeed;
		this.width = width;
		this.height = height;
		this.worldW = worldW;
		this.worldH = worldH;
	}

	fallDamage() {
		this.damage(1);
	}

	heal(hp) {
		if (this.health + hp >= this.maxHP) this.health = this.maxHP;
		else this.health += hp;
	}

	damage(dmg) {
		if (this.health - dmg <= 0) {
			this.isAlive = false;
		}
		this.health -= dmg;
	}
}

export default class PlayerEntity extends Entity {
	constructor(health, pos, velocity, flySpeed, width, height, tilesize, worldW, worldH, getTile) {
		super(health, pos, velocity, flySpeed, width, height, worldW, worldH);
		this.collision = new PlayerCollision(width, height, tilesize, worldW, worldH, getTile);
		this.inventory = new PlayerInventory();
		this.drill = new PlayerDrill(this.inventory, this.collision, 1, Math.floor(width * 0.5));
		this.sprite = new PlayerSprite(this.width, this.height, tilesize / 2, tilesize / 2, 0, 0);

		// this.inventory.add("BRONZE");
	}
}
