import ProductModel from './models/product.model.js';

class ProductDao {
    async findById(id) {
        return ProductModel.findById(id).lean();
    }

    async create(productData) {
        const product = new ProductModel(productData);
        return await product.save();
    }

    async updateStock(id, newStock) {
        return ProductModel.updateOne(
            { _id: id }, 
            { $set: { stock: newStock } }
        );
    }
    
    async getProductsByIds(ids) {
        return ProductModel.find({ _id: { $in: ids } }).lean();
    }

       async findAll(filters = {}) {
        return ProductModel.find(filters).lean();
    }

    async update(id, productData) {
        return ProductModel.findByIdAndUpdate(
            id, 
            productData, 
            { 
                new: true,
                runValidators: true
            }
        ).lean();
    }

    async delete(id) {
        return ProductModel.findByIdAndDelete(id).lean();
    }
}

export default new ProductDao();