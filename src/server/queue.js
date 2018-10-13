function Queue() {
  this.data = [];
}

// add to end of array
Queue.prototype.enqueue = function(record) {
  this.data.push(record);
}

// remove from beginning of array
Queue.prototype.dequeue = function() {
  this.data.shift();
}

// get the size of the queue
Queue.prototype.size = function() {
  return this.data.length;
}

// get the size of the queue
Queue.prototype.toArray = function() {
  return this.data;
}

module.exports = Queue;
