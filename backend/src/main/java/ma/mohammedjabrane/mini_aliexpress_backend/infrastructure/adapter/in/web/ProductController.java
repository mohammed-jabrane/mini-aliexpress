package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.in.web;

import lombok.RequiredArgsConstructor;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.ProductRequestDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.ProductResponseDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.mapper.ProductMapper;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.CreateProductUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.DeleteProductUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.GetProductByIdUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.SearchProductsUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.product.UpdateProductUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final CreateProductUseCase createProductUseCase;
    private final SearchProductsUseCase searchProductsUseCase;
    private final GetProductByIdUseCase getProductByIdUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;
    private final ProductMapper productMapper;

    @PostMapping
    public ResponseEntity<ProductResponseDTO> create(
            @RequestBody ProductRequestDTO request,
            JwtAuthenticationToken authentication) {
        UUID sellerId = UUID.fromString(authentication.getToken().getSubject());
        Product product = productMapper.toDomain(request, sellerId);
        Product created = createProductUseCase.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(productMapper.toResponse(created));
    }

    @GetMapping
    public List<ProductResponseDTO> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) UUID categoryId) {
        return searchProductsUseCase.searchProducts(q, categoryId).stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ProductResponseDTO getById(@PathVariable UUID id) {
        return productMapper.toResponse(getProductByIdUseCase.getProductById(id));
    }

    @PutMapping("/{id}")
    public ProductResponseDTO update(
            @PathVariable UUID id,
            @RequestBody ProductRequestDTO request,
            JwtAuthenticationToken authentication) {
        UUID sellerId = UUID.fromString(authentication.getToken().getSubject());
        Product product = productMapper.toDomain(request, sellerId);
        return productMapper.toResponse(updateProductUseCase.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        deleteProductUseCase.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
