
module.exports = {
  development: {
    server: "192.168.226.110",
    userName: "sa",
    password: "P@ssw0rd",
    pool: {
      min: 2,
      max: 4,
      log: true
    }
  },
  test: {
    server: "10.57.1.200",
    userName: "sa",
    password: "Changeme123",
    pool: {
      min: 2,
      max: 4,
      log: true
    }
  },
  production: {
    server: "127.0.0.1",
    userName: "sa",
    password: "P@ssw0rd",
    pool: {
      min: 2,
      max: 4,
      log: true
    }
  }
}
