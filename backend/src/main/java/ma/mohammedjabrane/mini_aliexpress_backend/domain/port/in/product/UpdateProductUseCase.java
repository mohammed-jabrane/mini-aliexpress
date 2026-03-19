package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;

import java.util.UUID;

public interface UpdateProductUseCase {

    Product updateProduct(UUID id, Product product);
}
