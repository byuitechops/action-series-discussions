module.exports = (course, discussion, callback) => {

    /* If the item is marked for deletion, do nothing */
    if (discussion.techops.delete === true) {
        callback(null, course, discussion);
        return;
    }

    /* Discussions to be deleted, in LOWER case */
    var doomedItems = [
        /questions\s*and\s*conversations/gi,
        /questions\s*&\s*conversations/gi,
    ];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = doomedItems.find(item => item.test(discussion.title));

    /* This is the action that happens if the test is passed */
    function action() {
        discussion.techops.delete = true;
        course.log('Discussions Deleted', {
            'Title': discussion.title,
            'ID': discussion.id
        });
        callback(null, course, discussion);
    }

    if (found != undefined) {
        action();
    } else {
        callback(null, course, discussion);
    }

};