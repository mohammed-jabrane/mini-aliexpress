package ma.mohammedjabrane.mini_aliexpress_backend.application.mapper;

import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.ProductRequestDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.ProductResponseDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;
import org.mapstruct.Mapper;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductResponseDTO toResponse(Product product);

    default Product toDomain(ProductRequestDTO dto, UUID sellerId) {
        return Product.builder()
                .name(dto.name())
                .description(dto.description())
                .price(dto.price())
                .stock(dto.stock())
                .categoryId(dto.categoryId())
                .sellerId(sellerId)
                .images(dto.images())
                .build();
    }
}
