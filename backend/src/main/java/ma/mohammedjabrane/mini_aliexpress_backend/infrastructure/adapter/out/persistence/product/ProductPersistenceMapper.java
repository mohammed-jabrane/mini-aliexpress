package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.out.persistence.product;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductPersistenceMapper {

    Product toDomain(ProductJpaEntity entity);

    ProductJpaEntity toEntity(Product domain);
}
