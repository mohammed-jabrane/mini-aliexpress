package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.in.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.ProductRequestDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.ProductResponseDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.mapper.ProductMapper;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.exception.ProductNotFoundException;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.CreateProductUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.DeleteProductUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.GetProductByIdUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.SearchProductsUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.UpdateProductUseCase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("ProductController")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CreateProductUseCase createProductUseCase;

    @MockBean
    private SearchProductsUseCase searchProductsUseCase;

    @MockBean
    private GetProductByIdUseCase getProductByIdUseCase;

    @MockBean
    private UpdateProductUseCase updateProductUseCase;

    @MockBean
    private DeleteProductUseCase deleteProductUseCase;

    @MockBean
    private ProductMapper productMapper;

    private static final UUID SELLER_ID = UUID.randomUUID();

    private JwtAuthenticationToken jwtAuth() {
        Jwt jwt = new Jwt("token", Instant.now(), Instant.now().plusSeconds(3600),
                Map.of("alg", "RS256"),
                Map.of("sub", SELLER_ID.toString()));
        return new JwtAuthenticationToken(jwt);
    }

    private ProductResponseDTO sampleResponse(UUID id) {
        return new ProductResponseDTO(
                id, "Laptop", "Gaming laptop", BigDecimal.valueOf(999.99), 5,
                UUID.randomUUID(), SELLER_ID, List.of("img.jpg"),
                LocalDateTime.now(), LocalDateTime.now()
        );
    }

    // ── POST /products ──────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /products")
    class Create {

        @Test
        @DisplayName("should return 201 with created product")
        void shouldReturn201WithCreatedProduct() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            ProductRequestDTO request = new ProductRequestDTO(
                    "Laptop", "Gaming laptop", BigDecimal.valueOf(999.99), 5, UUID.randomUUID(), List.of("img.jpg")
            );
            Product domain = Product.builder().name("Laptop").build();
            Product created = Product.builder().id(id).name("Laptop").build();
            ProductResponseDTO response = sampleResponse(id);

            when(productMapper.toDomain(any(ProductRequestDTO.class), eq(SELLER_ID))).thenReturn(domain);
            when(createProductUseCase.createProduct(domain)).thenReturn(created);
            when(productMapper.toResponse(created)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(post("/products")
                            .principal(jwtAuth())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.name").value("Laptop"));
        }
    }

    // ── GET /products ───────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /products")
    class Search {

        @Test
        @DisplayName("should return 200 with product list")
        void shouldReturn200WithProductList() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            Product product = Product.builder().id(id).name("Laptop").build();
            ProductResponseDTO response = sampleResponse(id);

            when(searchProductsUseCase.searchProducts(null, null)).thenReturn(List.of(product));
            when(productMapper.toResponse(product)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(get("/products"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(id.toString()))
                    .andExpect(jsonPath("$[0].name").value("Laptop"));
        }

        @Test
        @DisplayName("should pass query param to use case")
        void shouldPassQueryParam() throws Exception {
            // GIVEN
            when(searchProductsUseCase.searchProducts("phone", null)).thenReturn(List.of());

            // WHEN / THEN
            mockMvc.perform(get("/products").param("q", "phone"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isEmpty());

            verify(searchProductsUseCase).searchProducts("phone", null);
        }

        @Test
        @DisplayName("should pass categoryId param to use case")
        void shouldPassCategoryIdParam() throws Exception {
            // GIVEN
            UUID categoryId = UUID.randomUUID();
            when(searchProductsUseCase.searchProducts(null, categoryId)).thenReturn(List.of());

            // WHEN / THEN
            mockMvc.perform(get("/products").param("categoryId", categoryId.toString()))
                    .andExpect(status().isOk());

            verify(searchProductsUseCase).searchProducts(null, categoryId);
        }

        @Test
        @DisplayName("should return 200 with empty list when no products")
        void shouldReturn200WithEmptyList() throws Exception {
            // GIVEN
            when(searchProductsUseCase.searchProducts(null, null)).thenReturn(List.of());

            // WHEN / THEN
            mockMvc.perform(get("/products"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isEmpty());
        }
    }

    // ── GET /products/{id} ──────────────────────────────────────────────

    @Nested
    @DisplayName("GET /products/{id}")
    class GetById {

        @Test
        @DisplayName("should return 200 with product when found")
        void shouldReturn200WhenFound() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            Product product = Product.builder().id(id).name("Mouse").build();
            ProductResponseDTO response = sampleResponse(id);

            when(getProductByIdUseCase.getProductById(id)).thenReturn(product);
            when(productMapper.toResponse(product)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(get("/products/{id}", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()));
        }

        @Test
        @DisplayName("should propagate ProductNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            when(getProductByIdUseCase.getProductById(id))
                    .thenThrow(new ProductNotFoundException(id));

            // WHEN / THEN
            assertThatThrownBy(() -> mockMvc.perform(get("/products/{id}", id)))
                    .hasCauseInstanceOf(ProductNotFoundException.class);
        }
    }

    // ── PUT /products/{id} ──────────────────────────────────────────────

    @Nested
    @DisplayName("PUT /products/{id}")
    class Update {

        @Test
        @DisplayName("should return 200 with updated product")
        void shouldReturn200WithUpdatedProduct() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            ProductRequestDTO request = new ProductRequestDTO(
                    "Updated", "New desc", BigDecimal.valueOf(49.99), 15, UUID.randomUUID(), List.of()
            );
            Product domain = Product.builder().name("Updated").build();
            Product updated = Product.builder().id(id).name("Updated").build();
            ProductResponseDTO response = sampleResponse(id);

            when(productMapper.toDomain(any(ProductRequestDTO.class), eq(SELLER_ID))).thenReturn(domain);
            when(updateProductUseCase.updateProduct(eq(id), eq(domain))).thenReturn(updated);
            when(productMapper.toResponse(updated)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(put("/products/{id}", id)
                            .principal(jwtAuth())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()));
        }

        @Test
        @DisplayName("should propagate ProductNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            ProductRequestDTO request = new ProductRequestDTO(
                    "Updated", null, BigDecimal.TEN, 1, null, List.of()
            );
            Product domain = Product.builder().name("Updated").build();

            when(productMapper.toDomain(any(ProductRequestDTO.class), eq(SELLER_ID))).thenReturn(domain);
            when(updateProductUseCase.updateProduct(eq(id), eq(domain)))
                    .thenThrow(new ProductNotFoundException(id));

            // WHEN / THEN
            assertThatThrownBy(() -> mockMvc.perform(put("/products/{id}", id)
                            .principal(jwtAuth())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request))))
                    .hasCauseInstanceOf(ProductNotFoundException.class);
        }
    }

    // ── DELETE /products/{id} ───────────────────────────────────────────

    @Nested
    @DisplayName("DELETE /products/{id}")
    class Delete {

        @Test
        @DisplayName("should return 204 No Content")
        void shouldReturn204() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();

            // WHEN / THEN
            mockMvc.perform(delete("/products/{id}", id))
                    .andExpect(status().isNoContent());

            verify(deleteProductUseCase).deleteProduct(id);
        }

        @Test
        @DisplayName("should propagate ProductNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            doThrow(new ProductNotFoundException(id))
                    .when(deleteProductUseCase).deleteProduct(id);

            // WHEN / THEN
            assertThatThrownBy(() -> mockMvc.perform(delete("/products/{id}", id)))
                    .hasCauseInstanceOf(ProductNotFoundException.class);
        }
    }
}
