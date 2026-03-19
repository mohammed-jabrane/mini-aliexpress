package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product;

import java.util.UUID;

public interface DeleteProductUseCase {

    void deleteProduct(UUID id);
}
