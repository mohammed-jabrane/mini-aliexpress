package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.out.persistence;

import lombok.RequiredArgsConstructor;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.out.CategoryRepositoryPort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CategoryPersistenceAdapter implements CategoryRepositoryPort {

    private final CategoryJpaRepository jpaRepository;
    private final CategoryPersistenceMapper mapper;

    @Override
    public List<Category> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Category> findByParentId(UUID parentId) {
        return jpaRepository.findByParentId(parentId).stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Category> findRootCategories() {
        return jpaRepository.findByParentIdIsNull().stream()
                .map(mapper::toDomain)
                .toList();
    }
}
