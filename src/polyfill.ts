Array.prototype.toPage = function (pagination) {
  return {
    list: this,
    pagination,
  };
};

Array.prototype.toList = function () {
  return {
    list: this,
  };
};
