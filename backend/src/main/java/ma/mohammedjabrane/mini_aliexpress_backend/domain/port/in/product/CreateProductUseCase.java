package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;

public interface CreateProductUseCase {

    Product createProduct(Product product);
}
