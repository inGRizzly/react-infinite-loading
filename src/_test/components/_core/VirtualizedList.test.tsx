// Import(s) - Core
import { render, screen } from '@testing-library/react';

// Import(s) - Component
import { VirtualizedList, VirtualizedListProps } from "components/_core/VirtualizedList";

// Test
describe("VirtualizedList", () => {
    
    const setup = (props: VirtualizedListProps) => {
        
        const utils = render((
            <VirtualizedList {...props}/>
        ));
        const element = screen.getByRole("list") as HTMLDivElement;
        
        return {
            element,
            utils
        };
    };
    
    it("execute onInit prop with the virtualized list context", async () => {
        
        // Define variable(s)
        let ctx = undefined;
        
        // Setup element
        setup({
            onInit: (newCtx) => {
                ctx = newCtx;
            }
        });
        
        // Make test
        expect(ctx).toHaveProperty("scrollToIndex");
        expect(ctx).toHaveProperty("scrollIntoView");
        expect(ctx).toHaveProperty("scrollTo");
        expect(ctx).toHaveProperty("scrollBy");
        expect(ctx).toHaveProperty("autoscrollToBottom");
        expect(ctx).toHaveProperty("getState");
    });
});