package ma.mohammedjabrane.mini_aliexpress_backend.application.service;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.exception.ProductNotFoundException;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.out.ProductRepositoryPort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService")
class ProductServiceTest {

    @Mock
    private ProductRepositoryPort productRepository;

    @InjectMocks
    private ProductService productService;

    private Product buildProduct(UUID id, String name, UUID sellerId) {
        return Product.builder()
                .id(id)
                .name(name)
                .description("A product")
                .price(BigDecimal.valueOf(29.99))
                .stock(10)
                .categoryId(UUID.randomUUID())
                .sellerId(sellerId)
                .images(List.of("img1.jpg"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // ── createProduct ───────────────────────────────────────────────────

    @Nested
    @DisplayName("createProduct")
    class CreateProduct {

        @Test
        @DisplayName("should generate id and timestamps then save")
        void shouldGenerateIdAndTimestampsThenSave() {
            // GIVEN
            UUID sellerId = UUID.randomUUID();
            Product input = Product.builder()
                    .name("Laptop")
                    .description("Gaming laptop")
                    .price(BigDecimal.valueOf(999.99))
                    .stock(5)
                    .categoryId(UUID.randomUUID())
                    .sellerId(sellerId)
                    .images(List.of("laptop.jpg"))
                    .build();
            when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

            // WHEN
            Product result = productService.createProduct(input);

            // THEN
            assertThat(result.getId()).isNotNull();
            assertThat(result.getName()).isEqualTo("Laptop");
            assertThat(result.getSellerId()).isEqualTo(sellerId);
            assertThat(result.getCreatedAt()).isNotNull();
            assertThat(result.getUpdatedAt()).isNotNull();
            verify(productRepository).save(any(Product.class));
        }

        @Test
        @DisplayName("should preserve all input fields")
        void shouldPreserveAllInputFields() {
            // GIVEN
            UUID categoryId = UUID.randomUUID();
            UUID sellerId = UUID.randomUUID();
            List<String> images = List.of("a.jpg", "b.jpg");
            Product input = Product.builder()
                    .name("Phone")
                    .description("Smartphone")
                    .price(BigDecimal.valueOf(499.00))
                    .stock(20)
                    .categoryId(categoryId)
                    .sellerId(sellerId)
                    .images(images)
                    .build();
            when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

            // WHEN
            Product result = productService.createProduct(input);

            // THEN
            assertThat(result.getDescription()).isEqualTo("Smartphone");
            assertThat(result.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(499.00));
            assertThat(result.getStock()).isEqualTo(20);
            assertThat(result.getCategoryId()).isEqualTo(categoryId);
            assertThat(result.getImages()).containsExactly("a.jpg", "b.jpg");
        }
    }

    // ── getProductById ──────────────────────────────────────────────────

    @Nested
    @DisplayName("getProductById")
    class GetProductById {

        @Test
        @DisplayName("should return product when found")
        void shouldReturnProductWhenFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            Product product = buildProduct(id, "Keyboard", UUID.randomUUID());
            when(productRepository.findById(id)).thenReturn(Optional.of(product));

            // WHEN
            Product result = productService.getProductById(id);

            // THEN
            assertThat(result.getId()).isEqualTo(id);
            assertThat(result.getName()).isEqualTo("Keyboard");
        }

        @Test
        @DisplayName("should throw ProductNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            when(productRepository.findById(id)).thenReturn(Optional.empty());

            // WHEN / THEN
            assertThatThrownBy(() -> productService.getProductById(id))
                    .isInstanceOf(ProductNotFoundException.class)
                    .hasMessageContaining(id.toString());
        }
    }

    // ── searchProducts ──────────────────────────────────────────────────

    @Nested
    @DisplayName("searchProducts")
    class SearchProducts {

        @Test
        @DisplayName("should search by name when query is provided")
        void shouldSearchByNameWhenQueryProvided() {
            // GIVEN
            Product product = buildProduct(UUID.randomUUID(), "Laptop", UUID.randomUUID());
            when(productRepository.searchByName("Laptop")).thenReturn(List.of(product));

            // WHEN
            List<Product> result = productService.searchProducts("Laptop", null);

            // THEN
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).isEqualTo("Laptop");
            verify(productRepository).searchByName("Laptop");
            verify(productRepository, never()).findByCategoryId(any());
            verify(productRepository, never()).findAll();
        }

        @Test
        @DisplayName("should filter by category when categoryId is provided")
        void shouldFilterByCategoryWhenCategoryIdProvided() {
            // GIVEN
            UUID categoryId = UUID.randomUUID();
            Product product = buildProduct(UUID.randomUUID(), "Mouse", UUID.randomUUID());
            when(productRepository.findByCategoryId(categoryId)).thenReturn(List.of(product));

            // WHEN
            List<Product> result = productService.searchProducts(null, categoryId);

            // THEN
            assertThat(result).hasSize(1);
            verify(productRepository).findByCategoryId(categoryId);
            verify(productRepository, never()).searchByName(any());
            verify(productRepository, never()).findAll();
        }

        @Test
        @DisplayName("should return all products when no filters provided")
        void shouldReturnAllWhenNoFilters() {
            // GIVEN
            when(productRepository.findAll()).thenReturn(List.of(
                    buildProduct(UUID.randomUUID(), "A", UUID.randomUUID()),
                    buildProduct(UUID.randomUUID(), "B", UUID.randomUUID())
            ));

            // WHEN
            List<Product> result = productService.searchProducts(null, null);

            // THEN
            assertThat(result).hasSize(2);
            verify(productRepository).findAll();
        }

        @Test
        @DisplayName("should prioritize query over categoryId when both provided")
        void shouldPrioritizeQueryOverCategoryId() {
            // GIVEN
            UUID categoryId = UUID.randomUUID();
            when(productRepository.searchByName("Phone")).thenReturn(List.of());

            // WHEN
            List<Product> result = productService.searchProducts("Phone", categoryId);

            // THEN
            verify(productRepository).searchByName("Phone");
            verify(productRepository, never()).findByCategoryId(any());
        }

        @Test
        @DisplayName("should return all when query is blank")
        void shouldReturnAllWhenQueryIsBlank() {
            // GIVEN
            when(productRepository.findAll()).thenReturn(List.of());

            // WHEN
            List<Product> result = productService.searchProducts("   ", null);

            // THEN
            verify(productRepository).findAll();
            verify(productRepository, never()).searchByName(any());
        }
    }

    // ── updateProduct ───────────────────────────────────────────────────

    @Nested
    @DisplayName("updateProduct")
    class UpdateProduct {

        @Test
        @DisplayName("should update fields and preserve id, sellerId, createdAt")
        void shouldUpdateFieldsAndPreserveImmutableOnes() {
            // GIVEN
            UUID id = UUID.randomUUID();
            UUID sellerId = UUID.randomUUID();
            LocalDateTime createdAt = LocalDateTime.of(2025, 1, 1, 0, 0);
            Product existing = Product.builder()
                    .id(id)
                    .name("Old")
                    .description("Old desc")
                    .price(BigDecimal.TEN)
                    .stock(5)
                    .categoryId(UUID.randomUUID())
                    .sellerId(sellerId)
                    .images(List.of())
                    .createdAt(createdAt)
                    .updatedAt(createdAt)
                    .build();
            Product input = Product.builder()
                    .name("New")
                    .description("New desc")
                    .price(BigDecimal.valueOf(49.99))
                    .stock(15)
                    .categoryId(UUID.randomUUID())
                    .images(List.of("new.jpg"))
                    .build();
            when(productRepository.findById(id)).thenReturn(Optional.of(existing));
            when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

            // WHEN
            Product result = productService.updateProduct(id, input);

            // THEN
            assertThat(result.getId()).isEqualTo(id);
            assertThat(result.getName()).isEqualTo("New");
            assertThat(result.getDescription()).isEqualTo("New desc");
            assertThat(result.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(49.99));
            assertThat(result.getStock()).isEqualTo(15);
            assertThat(result.getSellerId()).isEqualTo(sellerId);
            assertThat(result.getCreatedAt()).isEqualTo(createdAt);
            assertThat(result.getUpdatedAt()).isAfter(createdAt);
            verify(productRepository).save(any(Product.class));
        }

        @Test
        @DisplayName("should throw ProductNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            Product input = Product.builder().name("New").build();
            when(productRepository.findById(id)).thenReturn(Optional.empty());

            // WHEN / THEN
            assertThatThrownBy(() -> productService.updateProduct(id, input))
                    .isInstanceOf(ProductNotFoundException.class)
                    .hasMessageContaining(id.toString());
            verify(productRepository, never()).save(any());
        }
    }

    // ── deleteProduct ───────────────────────────────────────────────────

    @Nested
    @DisplayName("deleteProduct")
    class DeleteProduct {

        @Test
        @DisplayName("should delete when product exists")
        void shouldDeleteWhenExists() {
            // GIVEN
            UUID id = UUID.randomUUID();
            when(productRepository.existsById(id)).thenReturn(true);

            // WHEN
            productService.deleteProduct(id);

            // THEN
            verify(productRepository).deleteById(id);
        }

        @Test
        @DisplayName("should throw ProductNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            when(productRepository.existsById(id)).thenReturn(false);

            // WHEN / THEN
            assertThatThrownBy(() -> productService.deleteProduct(id))
                    .isInstanceOf(ProductNotFoundException.class)
                    .hasMessageContaining(id.toString());
            verify(productRepository, never()).deleteById(any());
        }
    }
}
