const { supplier } = require("../../models/suppliers");
const { Op } = require("sequelize");
const ITEMS_PER_PAGE = 10;

const suppliers = async (req, res) => {
    try {
        const { page, firstName } = req.query;//firstName is the firstName of supplier to search for
        if(!page&&!firstName){
            let suppliers= await supplier.findAll();
            let  total=await supplier.count();
            return res.json({
                suppliers,
                hasMore:false,
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

        // Add the where clause if firstName is provided
        if (firstName) {
            query.where = {
                firstName: { [Op.iLike]: `%${firstName}%` }
            };
        }

        // Fetch suppliers based on the query
        const suppliers = await supplier.findAll(query);

        // Count the total number of suppliers based on the query
        const total = await supplier.count(query.where ? { where: query.where } : {});

        // Determine if there are more records
        const hasMore = offset + suppliers.length < total;

        return res.json({
            suppliers,
            hasMore,
            total
        });
    } catch (e) {
        console.log(e);
        return res.json({ error: 'server error occurred' });
    }
};

module.exports = { suppliers };
