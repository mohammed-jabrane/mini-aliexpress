package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.out.persistence.category;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryPersistenceMapper {

    Category toDomain(CategoryJpaEntity entity);

    CategoryJpaEntity toEntity(Category domain);
}
