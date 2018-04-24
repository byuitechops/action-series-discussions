/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, callback) => {
    tap.test('action-series-discussions', (tapTest) => {
        /*****************************************************************
         * Function template
         * function action_file_name_with_underscores(actionNameCallback)
         * Ex: function assignments_delete(deleteCallback)
         *****************************************************************/
        function discussions_delete(deleteCallback) {
            var found = '';

            /* Insert discussions to delete here */
            var doomedDiscussions = [
                /questions?\s*(and|&)\s*conversations?/gi,
            ];

            /* Get an array of all the discussions in the course */
            canvas.getDiscussions(course.info.canvasOU, (getDiscussionsErr, discussions) => {
                if (getDiscussionsErr) {
                    callback(getDiscussionsErr);
                    return;
                }
                /* For each doomedDiscussion, check if it still exists or not */
                doomedDiscussions.forEach(item => {
                    found = discussions.find(discussion => item.test(discussion.title));
                    if (found) {
                        tapTest.fail(`The discussion '${item}' was marked to be deleted but still exists`);
                    } else {
                        tapTest.pass(`The discussion '${item}' was deleted`);
                    }
                });
                deleteCallback(null);
            });
        }

        /* An array of functions for each associated action in action-series-discussions */
        var myFunctions = [
            discussions_delete,
        ];

        /* Run each universal grandchilds' test in its own function, one at a time */
        asyncLib.series(myFunctions, (seriesErr) => {
            if (seriesErr) {
                course.error(seriesErr);
            }
            tapTest.end();
        });
    });

    callback(null, course);
};