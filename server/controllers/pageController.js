const pageSize = 10;

function getPage(mongooseModel, queryObject, currentPage, callback) {


    mongooseModel.count({}, (err, count) => {
        if (err) {
            return callback(err);
        }

        const pagesCount = count / pageSize;

        mongooseModel
            .find(queryObject)
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            .exec((error, founded) => {
                if (error) {
                    callback(error);
                } else {
                    const pageInfo = { pageSize, currentPage, pagesCount };
                    callback(null, founded, pageInfo);
                }
            });
    });
}

module.exports.getPage = getPage;