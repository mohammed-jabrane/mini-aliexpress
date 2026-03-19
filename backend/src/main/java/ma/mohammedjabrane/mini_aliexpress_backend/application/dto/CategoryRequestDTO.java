package ma.mohammedjabrane.mini_aliexpress_backend.application.dto;

import java.util.UUID;

public record CategoryRequestDTO(String name, UUID parentId) {
}
