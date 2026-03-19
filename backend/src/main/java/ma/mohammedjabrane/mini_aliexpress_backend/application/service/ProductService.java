package ma.mohammedjabrane.mini_aliexpress_backend.application.service;

import lombok.RequiredArgsConstructor;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.exception.ProductNotFoundException;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Product;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.CreateProductUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.DeleteProductUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.GetProductByIdUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.SearchProductsUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.UpdateProductUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.out.ProductRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService implements
        CreateProductUseCase,
        SearchProductsUseCase,
        GetProductByIdUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase {

    private final ProductRepositoryPort productRepository;

    @Override
    public Product createProduct(Product product) {
        Product toSave = Product.builder()
                .id(UUID.randomUUID())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryId(product.getCategoryId())
                .sellerId(product.getSellerId())
                .images(product.getImages())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return productRepository.save(toSave);
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> searchProducts(String query, UUID categoryId) {
        if (query != null && !query.isBlank()) {
            return productRepository.searchByName(query);
        }
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        }
        return productRepository.findAll();
    }

    @Override
    public Product updateProduct(UUID id, Product product) {
        Product existing = getProductById(id);
        Product updated = Product.builder()
                .id(existing.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryId(product.getCategoryId())
                .sellerId(existing.getSellerId())
                .images(product.getImages())
                .createdAt(existing.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();
        return productRepository.save(updated);
    }

    @Override
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
    }
}
