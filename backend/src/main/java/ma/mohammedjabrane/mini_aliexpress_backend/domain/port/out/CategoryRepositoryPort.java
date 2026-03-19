package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.out;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepositoryPort {

    List<Category> findAll();

    Optional<Category> findById(UUID id);

    List<Category> findByParentId(UUID parentId);

    List<Category> findRootCategories();
}
