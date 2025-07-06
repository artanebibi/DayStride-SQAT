export async function populateAddTaskForm(page, taskName, taskCategory, taskDescription) {
    const todoButton = 'a[href="/todos"]'
    await page.click(todoButton)
    await page.waitForURL("/todos")

    const addTaskButton = "button.mantine-focus-auto:nth-child(5)"
    await page.click(addTaskButton)

    const taskNameField = "input[name=name]"
    const categoryField = "input[name=category]"
    const descriptionField = "textarea[name=description]"
    const dueDateField = "input[name=due_date]"
    const dueTimeField = "input[name=due_time]"

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formatted = futureDate.toISOString().split('T')[0];

    await page.fill(taskNameField, taskName)
    await page.fill(categoryField, taskCategory)
    await page.fill(descriptionField, taskDescription)
    await page.fill(dueDateField, formatted)
    await page.fill(dueTimeField, "12:34")

}