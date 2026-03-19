package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.out.persistence.product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductJpaRepository extends JpaRepository<ProductJpaEntity, UUID> {

    List<ProductJpaEntity> findByNameContainingIgnoreCase(String name);

    List<ProductJpaEntity> findByCategoryId(UUID categoryId);
}
