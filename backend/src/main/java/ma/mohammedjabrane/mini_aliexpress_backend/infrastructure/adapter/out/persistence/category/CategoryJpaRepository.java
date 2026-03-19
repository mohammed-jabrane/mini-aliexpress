package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.out.persistence.category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryJpaRepository extends JpaRepository<CategoryJpaEntity, UUID> {

    List<CategoryJpaEntity> findByParentId(UUID parentId);

    List<CategoryJpaEntity> findByParentIdIsNull();
}
