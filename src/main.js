const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#000000",
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
let lastFired = 0;
let score = 0;
let gameScene;

function preload() {
  // 리소스 로드
  this.load.image("player", "./assets/player.png");
  this.load.image("bullet", "./assets/bullet.png");
  this.load.image("enemy", "./assets/enemy.png");
}

function create() {
  // 초기화 설정
  gameScene = this;
  this.input.keyboard.on("keydown-F", () => {
    if (!this.scale.isFullscreen) {
      this.scale.startFullscreen();
    } else {
      this.scale.stopFullscreen();
    }
  });

  Toastify(
    Object.assign({
      text: "F키를 눌러 풀스크린 전환이 가능합니다.",
    })
  ).showToast();

  player = this.physics.add.sprite(
    this.cameras.main.width / 2,
    (this.cameras.main.height / 4) * 3,
    "player"
  );
  player.setCollideWorldBounds(true); // 화면 밖으로 나가지 않게 설정
  player.setDisplaySize(100, 100);

  this.enemies = this.physics.add.group({
    key: "enemy",
    repeat: 20, // 적 개수
    setXY: { x: 100, y: this.cameras.main.height }, // 시작 위치와 간격
  });

  this.enemies.children.iterate((enemy) => {
    enemy.setDisplaySize(40, 40);
    enemy.setVelocityY(100);
  });

  // 키보드 입력 설정
  this.cursors = this.input.keyboard.createCursorKeys();
  this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  this.bullets = this.physics.add.group();

  this.fireBullet = () => {
    const bullet = this.physics.add.sprite(player.x, player.y - 40, "bullet");
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setCircle(5);
    bullet.body.velocity.y = -1000;
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
    this.physics.add.collider(bullet, this.enemies, destroyEnemy, null, this);
  };

  this.physics.add.collider(player, this.enemies, loseGame, null, this);

  const winInterval = setInterval(() => {
    console.log(this.enemies);
    if (this.enemies.getLength() < 1) {
      clearInterval(winInterval);
      Toastify(
        Object.assign({
          text: `와 이겼다!`,
        })
      ).showToast();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, 1000);
}

function update(time) {
  // 게임 루프 로직
  if (this.cursors.left.isDown) {
    player.setVelocityX(-600);
  } else if (this.cursors.right.isDown) {
    player.setVelocityX(600);
  } else {
    player.setVelocityX(0);
  }

  if (this.cursors.up.isDown) {
    player.setVelocityY(-600);
  } else if (this.cursors.down.isDown) {
    player.setVelocityY(600);
  } else {
    player.setVelocityY(0);
  }

  this.enemies.children.iterate((enemy) => {
    if (enemy.y > this.cameras.main.height) {
      enemy.y = -50;
      enemy.x = Phaser.Math.Between(50, this.cameras.main.width - 50);
    }
  });

  if (Phaser.Input.Keyboard.JustDown(this.zKey) && time > lastFired) {
    this.fireBullet();
    lastFired = time + 50;
  }
}

function destroyEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();
  score += 100;
}

function loseGame(player, enemy) {
  player.destroy();
  gameScene.scene.pause();
  Toastify(
    Object.assign({
      text: `졌다! ${score}점!`,
    })
  ).showToast();
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}
