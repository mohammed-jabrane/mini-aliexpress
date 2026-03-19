package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.out;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepositoryPort {

    Product save(Product product);

    Optional<Product> findById(UUID id);

    List<Product> findAll();

    List<Product> searchByName(String query);

    List<Product> findByCategoryId(UUID categoryId);

    void deleteById(UUID id);

    boolean existsById(UUID id);
}
