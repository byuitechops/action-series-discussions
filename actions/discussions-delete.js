/******************************************************************************
 * Discussions Delete
 * Description: Create an array of discussion titles and set their delete 
 * attribute on the TechOps class to true. If the delete attribute is set to 
 * true, the discussion will be deleted in action-series-master main.js 
 ******************************************************************************/
module.exports = (course, discussion, callback) => {
    try {




        /* If the item is marked for deletion, do nothing */
        if (discussion.techops.delete === true) {
            callback(null, course, discussion);
            return;
        }

        /* Discussions to be deleted, in LOWER case */
        var doomedItems = [
            /questions?\s*(and|&)\s*conversations?/gi,
        ];

        /* The test returns TRUE or FALSE - action() is called if true */
        var found = doomedItems.find(item => item.test(discussion.title));

        /* This is the action that happens if the test is passed */
        function action() {
            var logCategory = 'Deleted Discussions';

            /* If we're running a standards check and not doing any changes... */
            if (course.info.checkStandard === true) {
                logCategory = 'Deprecated Discussions';
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
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, discussion);
    }
};

module.exports.details = {
    title: 'discussions-delete'
}