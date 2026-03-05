package com.anhtuan.todo.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

// ── Create request ───────────────────────────────────────────
public class CreateRequest {

    @NotBlank @Size(max = 200)
    private String text;

    @Pattern(regexp = "high|medium|low", message = "Priority must be high, medium or low")
    private String priority = "medium";

    private LocalDate deadline;
    private String    listId = "personal";

    public String    getText()     { return text; }
    public String    getPriority() { return priority; }
    public LocalDate getDeadline() { return deadline; }
    public String    getListId()   { return listId; }

    public void setText(String t)        { this.text = t; }
    public void setPriority(String p)    { this.priority = p; }
    public void setDeadline(LocalDate d) { this.deadline = d; }
    public void setListId(String l)      { this.listId = l; }
}
