const { purchase } = require("../../models/purchase");
const { Op } = require("sequelize");
const { supplier } = require("../../models/suppliers");
const ITEMS_PER_PAGE = 10;

const purchases = async (req, res) => {
    try {
        const { page, supplierName } = req.query; //supplierName is to search purchases by supplier name
        if (!page && !supplierName) {
            let purchases = await purchase.findAll();
            let total = await purchase.count();
            return res.json({
                purchases,
                hasMore: false,
                total
            })
        }
        // Validate the page parameter
        if (!page || page <= 0) {
            return res.json({ error: 'provide valid page number' });
        }

        // Determine the offset for pagination
        const offset = ITEMS_PER_PAGE * (page - 1);

        // Create a base query object
        const query = {
            limit: ITEMS_PER_PAGE,
            offset,
            order: [['createdAt', 'DESC']]
        };

        // Add the where clause if supplierName of the purchase is provided
        if (supplierName && supplierName.length > 0) {
            query.where = {
                supplierName: { [Op.iLike]: `%${supplierName}%` }
            };
        }

        // Fetch purchases based on the query
        const purchases = await purchase.findAll(query);

        // Count the total number of purchases based on the query
        const total = await purchase.count(query.where ? { where: query.where } : {});

        // Determine if there are more records
        const hasMore = offset + purchases.length < total;

        return res.json({
            purchases,
            hasMore,
            total
        });
    } catch (e) {
        console.log(e);
        return res.json({ error: 'server error occurred' });
    }
};

module.exports = { purchases };
