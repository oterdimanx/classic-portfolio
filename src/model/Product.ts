import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName : String,
    productDescription :String,
    productImage : String,
    productSlug : String,
    productPrice : Number,
    productQuantity : Number,
    productFeatured : Boolean,

    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },

},{timestamps : true});

// Pre-save hook for slug generation
ProductSchema.pre('save', async function(next) {

    console.log('[HOOK] Pre-save hook triggered for product:', this.productName);
    console.log('[HOOK] Current slug before modification:', this.productSlug);
    // Run always on new creates, or if name modified on updates
    if (this.isNew || this.isModified('name')) {

        console.log('[HOOK] Condition met—generating/updating slug');
        // Use createdAt if available, else current (for new)
        const date = this.createdAt ? this.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        let slug = `${this.productSlug}-${date}`;

        // Uniqueness check loop
        console.log('[HOOK] Checking uniqueness for base:', slug);
        let count = 1;
        while (await Product.findOne({productSlug: slug})) {
        slug = `${this.productSlug}-${date}-${count}`;
        count++;
        console.log('[HOOK] Collision—trying:', slug);
        }

        this.productSlug = slug;
        console.log('[HOOK] Final set slug:', this.productSlug);
  } else {
    console.log('[HOOK] Condition not met—skipping');
  }
  next();
});

const Product = mongoose.models.Products  || mongoose.model('Products', ProductSchema);

export default Product;