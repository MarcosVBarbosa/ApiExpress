class User {
  index(req, res) {
    return res.json("INDEX");
  }
  show(req, res) {
    return res.json("SHOW");
  }
  create(req, res) {
    return res.json("CREATE");
  }
  update(req, res) {
    return res.json("UPDATE");
  }
  destroy(req, res) {
    return res.json("DESTROY");
  }
}

export default new User();
