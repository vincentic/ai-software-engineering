package cn.lim.todolistservice.dto;

import cn.lim.todolistservice.entity.Todo;

import java.util.List;

public class TodoPageResponse {
    private List<Todo> items;
    private long total;
    private int page;
    private int pageSize;
    private int totalPages;

    public TodoPageResponse(List<Todo> items, long total, int page, int pageSize) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = pageSize == 0 ? 0 : (int) Math.ceil((double) total / pageSize);
    }

    public List<Todo> getItems() {
        return items;
    }

    public void setItems(List<Todo> items) {
        this.items = items;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
}
