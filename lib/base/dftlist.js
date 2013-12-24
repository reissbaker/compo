/*
 * Note: backing the DFTList with a dense array (DFTArray?) would make
 * insertions and removals O(n), but might make iteration incredibly fast due to
 * the good CPU caching property of arrays.
 *
 * (Probably depends how complicated individual object's callback functions
 * are; if they load too much into the cache they could overwrite the array.
 * Seems a little unlikely though.)
 *
 * That might be a good tradeoff for games to make: it doesn't seem likely that
 * there would be enough objects in the game that O(nlogn) setup cost would be
 * prohibitively expensive, and assuming that most objects stick around during
 * the lifecycle of a level (you could just make dead ones invisible and
 * noninteractable), the iteration speedup might allow for more complex scenes.
 *
 * How would a multidimensional DFTList work? You would keep a "true" DFTList
 * with everything in it, along with any number of sub-DFTLists that have their
 * next and prev pointers set to the next and previous items in their dimension
 * (rather than overall). When adding new elements, you would have to look in
 * the "true" DFTList to find which items are next in the given dimension, and
 * set the pointers appropriately.
 *
 * Note: the "true" nodes that don't exist in certain dimensions should have
 * references to the closest subdimensional nodes, so that you don't have to
 * search the whole tree. (No: you'll have to search the whole tree on insert()
 * and remove() to update the pointers to the closest nodes... Or have arrays of
 * parents for subdimensional nodes? One parent, many godparents? Ooh,
 * interesting. That might work, needs more thought: what happens when you
 * insert something in an intermediate node, how do you find godparents? Oh,
 * duh, the intermediate node already had a pointer to its nearest subdimension
 * node, and anything referencing that is in the godparent array. Figure out if
 * any of the godparents are now closer to the new intermediate, and update them
 * accordingly and remove from the godparent array. You can figure out distance
 * pretty quickly if you allocate two arrays (one negative and one positive) and
 * stick intermediary nodes in them during the calculation process; their
 * placement in the arrays marks their leftwards or rightwards distance from the
 * node, and if you come across one you've already seen you can stop calculating
 * and use its ditance index. Err not sure array is best data structure, but
 * maybe GUID + hash table w/distance as value.)
 *
 * It's probably worthwhile to keep sibling pointers: if a subtree is "turned
 * off" (not renderable, not updatable, etc) by some flag, you'll want to jump
 * to the next sibling rather than continuing through the children. You could
 * probably find the siblings by exploiting the tree invariates, but it would be
 * slower than just having the pointers.
 */

!function(exports) {
  'use strict';

  function DFTList(data) {
    this.data = data;

    this.parent = null;
    this.head = null;
    this.tail = null;
    this.next = null;
    this.prev = null;
  }

  DFTList.prototype.push = function(child) {
    var predecessor, childDescendant, rightmostDescendant;

    child.parent = this;

    if(this.head === null) this.head = child;

    // The new tail's rightmost descendant's successor is current node's
    // rightmost descendant's successor.
    childDescendant = rightmost(child);
    rightmostDescendant = rightmost(this);
    childDescendant.next = rightmostDescendant.next;
    if(rightmostDescendant.next) {
      rightmostDescendant.next.prev = childDescendant;
    }
    rightmostDescendant.next = childDescendant;

    // The new tail's predecessor is the rightmost node in the previous
    // sibling's subtree. If there is no previous sibling, the parent is the
    // predecessor.
    predecessor = rightmost(this.tail) || this;
    child.prev = predecessor;
    predecessor.next = child;

    // Insert child as tail.
    this.tail = child;

    return child;
  };

  DFTList.prototype.unshift = function(child) {
    var predecessor, childDescendant;

    // Unshifting into a node with no children is equivalent to pushing. Don't
    // bother reimplementing.
    if(!this.head) return this.push(child);

    child.parent = this;

    // The new head's predecessor is its parent.
    predecessor = this;
    // The new head's rightmost descendant's successor is the current node's
    // successor.
    childDescendant = rightmost(child);
    childDescendant.next = this.next;
    if(this.next) this.next.prev = childDescendant;


    this.next = child;
    child.prev = this;

    this.head = child;

    return child;
  };

  DFTList.prototype.pop = function() { return splice(this, this.tail); };
  DFTList.prototype.shift = function() { return splice(this, this.head); };
  DFTList.prototype.remove = function(child) { return !!splice(this, child); };

  DFTList.prototype.each = function(callback) {
    for(var curr = this; curr; curr = curr.next) {
      callback(curr);
    }
  };

  /*
   * Moderately inefficient.
   */
  DFTList.prototype.subtreeEach = function(callback) {
    var rightSib = nextRightSubtree(this),
        curr = this.next;
    while(curr !== rightSib) {
      callback(curr);
      curr = curr.next;
    }
    return this;
  };

  /*
   * Super inefficient.
   */
  DFTList.prototype.eachChild = function(callback) {
    var that = this;
    this.subtreeEach(function(descendant) {
      if(that === descendant.parent) callback(descendant);
    });
  };

  function splice(parent, child) {
    // Handle bad input
    if(!child) return null;
    if(child.parent !== parent) return null;

    var prev = child.prev,
        nextSubtree = nextRightSubtree(child);

    // Update previous node and next subtree
    if(prev) prev.next = nextSubtree;
    if(right) {
      nextSubtree.prev.next = null;
      nextSubtree.prev = prev;
    }

    // Update parent head, tail
    if(child === parent.head) {
      if(right.parent === parent) parent.head = nextSubtree;
      else parent.head = parent.tail = null;
    }

    if(child === parent.tail) {
      if(prev.parent === parent) parent.tail = prev;
      else parent.head = parent.tail = null;
    }

    // Cut off child
    child.parent = child.next = child.prev = null;

    return child;
  }

  function nextRightSubtree(node) {
    var rightmostDescendant = rightmost(node);
    if(rightmostDescendant) return rightmostDescendant.next;
    return null;
  }

  function rightmost(node) {
    if(!node) return null;
    if(node.tail) return rightmost(node.tail);
    return node;
  }

  exports.DFTList = DFTList;

}(seine);
