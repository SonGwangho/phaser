const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  scale: {
    mode: Phaser.Scale.RESIZE, // 화면 크기 자동 조정
    autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 중앙 정렬
  },
};

const game = new Phaser.Game(config);

function preload() {
  // 리소스 로드
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

  this.add.text(50, 50, "Press F for Fullscreen", {
    fontSize: "24px",
    fill: "#ffffff",
  });
}

function update() {
  // 게임 루프 로직
}
