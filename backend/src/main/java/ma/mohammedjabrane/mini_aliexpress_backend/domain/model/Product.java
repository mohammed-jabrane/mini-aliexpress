package ma.mohammedjabrane.mini_aliexpress_backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class Product {

    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private UUID categoryId;
    private UUID sellerId;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
