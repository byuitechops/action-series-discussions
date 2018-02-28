/* Dependencies */
const canvas = require('canvas-wrapper');

/* Actions */
var actions = [
    require('../actions/discussions-delete.js'),
];

class TechOps {
    constructor() {
        this.getHTML = getHTML;
        this.setHTML = setHTML;
        this.getPosition = getPosition;
        this.setPosition = setPosition;
        this.getTitle = getTitle;
        this.setTitle = setTitle;
        this.getID = getID;
        this.delete = false;
        this.type = 'Discussion';
    }
}

/* Retrieve all items of the type */
function getItems(course, callback) {
    /* Get all of the discussions from Canvas */
    canvas.getDiscussions(course.info.canvasOU, (err, items) => {
        if (err) {
            callback(err);
            return;
        }
        /* Give each item the TechOps helper class */
        items.forEach(it => {
            it.techops = new TechOps();
        });

        callback(null, items);
    });
}

/* Build the PUT object for an item */
function buildPutObj(discussion) {
    return {
        'title': discussion.title,
        'message': discussion.message,
        'discussion_type': discussion.discussion_type,
        'published': discussion.published,
        'delayed_post_at': discussion.delayed_post_at,
        'lock_at': discussion.lock_at,
        'podcast_enabled': discussion.podcast_enabled,
        'podcast_has_student_posts': discussion.podcast_has_student_posts,
        'require_initial_post': discussion.require_initial_post,
        'assignment': discussion.assignment,
        'is_announcement': discussion.is_announcement,
        'pinned': discussion.pinned,
        'position_after': discussion.position_after,
        'group_category_id': discussion.group_category_id,
        'allow_rating': discussion.allow_rating,
        'only_graders_can_rate': discussion.only_graders_can_rate,
        'sort_by_rating': discussion.sort_by_rating,
        'specific_sections': discussion.specific_sections,
    };
}

function deleteItem(course, discussion, callback) {
    canvas.delete(`/api/v1/courses/${course.info.canvasOU}/discussion_topics/${discussion.id}`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, null);
    });
}

/* PUT an item back into Canvas with updates */
function putItem(course, discussion, callback) {
    if (discussion.delete == true) {
        deleteItem(course, discussion, callback);
        return;
    }
    var putObj = buildPutObj(discussion);
    canvas.put(`/api/v1/courses/${course.info.canvasOU}/discussion_topics/${discussion.id}`, putObj, (err, newItem) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, newItem);
    });
}

function getHTML(item) {
    return null;
}

function setHTML(item, newHTML) {
    return null;
}

function getTitle(item) {
    return item.title;
}

function setTitle(item, newTitle) {
    item.title = newTitle;
}

function getPosition(item) {
    return null;
}

function setPosition(item, newPosition) {
    return null;
}

function getID(item) {
    return item.id;
}

module.exports = {
    actions: actions,
    getItems: getItems,
    putItem: putItem,
};