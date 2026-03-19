package ma.mohammedjabrane.mini_aliexpress_backend.application.mapper;

import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryRequestDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryResponseDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "children", expression = "java(java.util.List.of())")
    CategoryResponseDTO toResponse(Category category);

    default Category toDomain(CategoryRequestDTO dto) {
        return Category.builder()
                .name(dto.name())
                .parentId(dto.parentId())
                .build();
    }
}
