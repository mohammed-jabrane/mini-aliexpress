package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;

import java.util.UUID;

public interface GetProductByIdUseCase {

    Product getProductById(UUID id);
}
