const {supplier} = require("../../models/suppliers");
const supplierDestroy = async (req, res) => {
    try {
        const { id } = req.body;

        // Check if id is provided
        if (!id) {
            return res.status(400).json({ error: 'Supplier ID is required.' });
        }

        const result = await supplier.destroy({ where: { id: id } });

        // Check if any records were deleted
        if (result === 0) {
            return res.status(404).json({ error: 'Supplier not found.' });
        }

        return res.status(200).json({ message: 'Records deleted successfully' });
    } catch (e) {
        return res.status(500).json({ error: 'Cannot delete the supplier.' });
    }
};

module.exports={supplierDestroy}