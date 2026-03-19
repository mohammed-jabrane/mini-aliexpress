package ma.mohammedjabrane.mini_aliexpress_backend.application.mapper;

import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.ProductRequestDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.ProductResponseDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ProductMapper")
class ProductMapperTest {

    private final ProductMapper mapper = Mappers.getMapper(ProductMapper.class);

    // ── toResponse ──────────────────────────────────────────────────────

    @Nested
    @DisplayName("toResponse")
    class ToResponse {

        @Test
        @DisplayName("should map all product fields to response DTO")
        void shouldMapAllFields() {
            // GIVEN
            UUID id = UUID.randomUUID();
            UUID categoryId = UUID.randomUUID();
            UUID sellerId = UUID.randomUUID();
            LocalDateTime now = LocalDateTime.now();
            Product product = Product.builder()
                    .id(id)
                    .name("Laptop")
                    .description("Gaming laptop")
                    .price(BigDecimal.valueOf(999.99))
                    .stock(5)
                    .categoryId(categoryId)
                    .sellerId(sellerId)
                    .images(List.of("img1.jpg", "img2.jpg"))
                    .createdAt(now)
                    .updatedAt(now)
                    .build();

            // WHEN
            ProductResponseDTO response = mapper.toResponse(product);

            // THEN
            assertThat(response.id()).isEqualTo(id);
            assertThat(response.name()).isEqualTo("Laptop");
            assertThat(response.description()).isEqualTo("Gaming laptop");
            assertThat(response.price()).isEqualByComparingTo(BigDecimal.valueOf(999.99));
            assertThat(response.stock()).isEqualTo(5);
            assertThat(response.categoryId()).isEqualTo(categoryId);
            assertThat(response.sellerId()).isEqualTo(sellerId);
            assertThat(response.images()).containsExactly("img1.jpg", "img2.jpg");
            assertThat(response.createdAt()).isEqualTo(now);
            assertThat(response.updatedAt()).isEqualTo(now);
        }

        @Test
        @DisplayName("should handle null optional fields")
        void shouldHandleNullOptionalFields() {
            // GIVEN
            UUID id = UUID.randomUUID();
            UUID sellerId = UUID.randomUUID();
            LocalDateTime now = LocalDateTime.now();
            Product product = Product.builder()
                    .id(id)
                    .name("Simple")
                    .description(null)
                    .price(BigDecimal.ONE)
                    .stock(0)
                    .categoryId(null)
                    .sellerId(sellerId)
                    .images(null)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();

            // WHEN
            ProductResponseDTO response = mapper.toResponse(product);

            // THEN
            assertThat(response.description()).isNull();
            assertThat(response.categoryId()).isNull();
            assertThat(response.images()).isNull();
        }
    }

    // ── toDomain ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("toDomain")
    class ToDomain {

        @Test
        @DisplayName("should map request DTO and sellerId to domain product")
        void shouldMapRequestAndSellerId() {
            // GIVEN
            UUID sellerId = UUID.randomUUID();
            UUID categoryId = UUID.randomUUID();
            ProductRequestDTO request = new ProductRequestDTO(
                    "Phone", "Smartphone", BigDecimal.valueOf(699.00), 10, categoryId, List.of("phone.jpg")
            );

            // WHEN
            Product product = mapper.toDomain(request, sellerId);

            // THEN
            assertThat(product.getId()).isNull();
            assertThat(product.getName()).isEqualTo("Phone");
            assertThat(product.getDescription()).isEqualTo("Smartphone");
            assertThat(product.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(699.00));
            assertThat(product.getStock()).isEqualTo(10);
            assertThat(product.getCategoryId()).isEqualTo(categoryId);
            assertThat(product.getSellerId()).isEqualTo(sellerId);
            assertThat(product.getImages()).containsExactly("phone.jpg");
        }

        @Test
        @DisplayName("should not set id, createdAt, or updatedAt")
        void shouldNotSetTimestamps() {
            // GIVEN
            UUID sellerId = UUID.randomUUID();
            ProductRequestDTO request = new ProductRequestDTO(
                    "Item", null, BigDecimal.TEN, 1, null, List.of()
            );

            // WHEN
            Product product = mapper.toDomain(request, sellerId);

            // THEN
            assertThat(product.getId()).isNull();
            assertThat(product.getCreatedAt()).isNull();
            assertThat(product.getUpdatedAt()).isNull();
        }
    }
}
