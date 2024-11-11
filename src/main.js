const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  // 리소스 로드
}

function create() {
  // 초기화 설정
  this.add.text(200, 300, "Hello, Phaser!", { fontSize: "32px", fill: "#fff" });
}

function update() {
  // 게임 루프 로직
}
