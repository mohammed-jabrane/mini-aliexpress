package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;

import java.util.List;
import java.util.UUID;

public interface SearchProductsUseCase {

    List<Product> searchProducts(String query, UUID categoryId);
}
