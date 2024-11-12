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

function preload() {
  // 리소스 로드
  this.load.image("player", "./assets/player.png");
  this.load.image("bullet", "./assets/bullet.png");
}

function create() {
  // 초기화 설정
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

  // 키보드 입력 설정
  this.cursors = this.input.keyboard.createCursorKeys();
  this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

  this.fireBullet = () => {
    const bullet = this.physics.add.sprite(player.x, player.y - 40, "bullet");
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.body.velocity.y = -1000;
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
  };
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

  if (Phaser.Input.Keyboard.JustDown(this.zKey) && time > lastFired) {
    this.fireBullet();
    lastFired = time + 50;
  }
}
