package ma.mohammedjabrane.mini_aliexpress_backend.application.mapper;

import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryRequestDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryResponseDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CategoryMapper")
class CategoryMapperTest {

    private final CategoryMapper mapper = Mappers.getMapper(CategoryMapper.class);

    // ── toResponse ──────────────────────────────────────────────────────

    @Nested
    @DisplayName("toResponse")
    class ToResponse {

        @Test
        @DisplayName("should map all category fields to response DTO")
        void shouldMapAllFields() {
            // GIVEN
            UUID id = UUID.randomUUID();
            UUID parentId = UUID.randomUUID();
            Category category = Category.builder()
                    .id(id)
                    .name("Electronics")
                    .parentId(parentId)
                    .build();

            // WHEN
            CategoryResponseDTO response = mapper.toResponse(category);

            // THEN
            assertThat(response.id()).isEqualTo(id);
            assertThat(response.name()).isEqualTo("Electronics");
            assertThat(response.parentId()).isEqualTo(parentId);
            assertThat(response.children()).isEmpty();
        }

        @Test
        @DisplayName("should handle null parentId for root category")
        void shouldHandleNullParentId() {
            // GIVEN
            UUID id = UUID.randomUUID();
            Category category = Category.builder()
                    .id(id)
                    .name("Root")
                    .parentId(null)
                    .build();

            // WHEN
            CategoryResponseDTO response = mapper.toResponse(category);

            // THEN
            assertThat(response.id()).isEqualTo(id);
            assertThat(response.name()).isEqualTo("Root");
            assertThat(response.parentId()).isNull();
            assertThat(response.children()).isEmpty();
        }
    }

    // ── toDomain ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("toDomain")
    class ToDomain {

        @Test
        @DisplayName("should map request DTO name and parentId to domain")
        void shouldMapNameAndParentId() {
            // GIVEN
            UUID parentId = UUID.randomUUID();
            CategoryRequestDTO request = new CategoryRequestDTO("Phones", parentId);

            // WHEN
            Category category = mapper.toDomain(request);

            // THEN
            assertThat(category.getId()).isNull();
            assertThat(category.getName()).isEqualTo("Phones");
            assertThat(category.getParentId()).isEqualTo(parentId);
        }

        @Test
        @DisplayName("should handle null parentId for root category")
        void shouldHandleNullParentId() {
            // GIVEN
            CategoryRequestDTO request = new CategoryRequestDTO("Root Category", null);

            // WHEN
            Category category = mapper.toDomain(request);

            // THEN
            assertThat(category.getId()).isNull();
            assertThat(category.getName()).isEqualTo("Root Category");
            assertThat(category.getParentId()).isNull();
        }
    }
}
