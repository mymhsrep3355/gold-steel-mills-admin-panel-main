const {purchase} = require("../../models/purchase");
const purchaseDestroy = async (req, res) => {
    try {
        const { id } = req.body;

        // Check if id is provided
        if (!id) {
            return res.status(400).json({ error: 'Purchase ID is required.' });
        }

        const result = await purchase.destroy({ where: { id: id } });

        // Check if any records were deleted
        if (result === 0) {
            return res.status(404).json({ error: 'purchase not found.' });
        }

        return res.status(200).json({ message: 'records deleted successfully' });
    } catch (e) {
        return res.status(500).json({ error: 'Cannot delete the purchase.' });
    }
};

module.exports={purchaseDestroy}