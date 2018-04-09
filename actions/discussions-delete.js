module.exports = (course, discussion, callback) => {
    //only add the platforms your grandchild should run in
    var validPlatforms = ['online', 'pathway'];
    var validPlatform = validPlatforms.includes(course.settings.platform);

    /* If the item is marked for deletion, do nothing */
    if (discussion.techops.delete === true || validPlatform !== true) {
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
        var logCategory = 'Discussion - Deleted';

        /* If we're running a standards check and not doing any changes... */
        if (course.info.checkStandard === true) {
            logCategory = 'Discussion - Deprecated';
        } else {
            discussion.techops.delete = true;
        }

        discussion.techops.log(logCategory, {
            'Title': discussion.title,
            'ID': discussion.id
        });
        callback(null, course, discussion);
    }

    /* The Test */
    if (found !== undefined) {
        action();
    } else {
        callback(null, course, discussion);
    }

};