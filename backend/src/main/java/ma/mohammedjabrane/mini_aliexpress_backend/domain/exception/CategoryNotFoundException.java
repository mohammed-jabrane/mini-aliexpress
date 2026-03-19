package ma.mohammedjabrane.mini_aliexpress_backend.domain.exception;

import java.util.UUID;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(UUID id) {
        super("Category not found with id: " + id);
    }
}
