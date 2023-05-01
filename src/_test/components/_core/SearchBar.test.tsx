// Import(s) - Core
import { fireEvent, render, screen, within } from '@testing-library/react';

// Import(s) - Component
import { SearchBar, SearchBarProps } from 'components/_core/SearchBar';

// Test
describe("SearchBar", () => {

    const setup = (props: SearchBarProps) => {
        
        const utils = render((
            <SearchBar {...props}/>
        ));
        const element = screen.getByRole("search") as HTMLDivElement;
        
        return {
            element,
            utils
        };
    };
    
    it("should be the mapped input value get from onChange prop", async () => {
        
        // Define variable(s)
        let onChangeValue = undefined;
        
        // Setup element
        const {
            element
        } = setup({
            onChange: (value) => {
                onChangeValue = value;
            }
        });
        
        // Define children element(s)
        const input = within(element).getByRole("searchbox");
        
        // Make test
        fireEvent.change(input, { target: { value: "44" } });
        expect(onChangeValue).toBe("44");
    });
    
    it("has the focused className applied on focus", async () => {
        
        // Define variable(s)
        let classNameFocused = "search-bar-focused";
        
        // Setup element
        const {
            element
        } = setup({
            classNameFocused
        });
        
        // Define children element(s)
        const input = within(element).getByRole("searchbox");
        
        // Make test
        fireEvent.focus(input);
        expect(element.classList.contains(classNameFocused)).toBe(true);
    });
    
    it("has the focused className removed on blur", async () => {
        
        // Define variable(s)
        let classNameFocused = "search-bar-focused";
        
        // Setup element
        const {
            element
        } = setup({
            classNameFocused
        });
        
        // Define children element(s)
        const input = within(element).getByRole("searchbox");
        
        // Make test
        fireEvent.blur(input);
        expect(element.classList.contains(classNameFocused)).toBe(false);
    });
});
